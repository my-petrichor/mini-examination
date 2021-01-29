package api

import (
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	_ "net/http/pprof"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/my-Sakura/go-yuque-api/api"
)

type question struct {
	Id      int    `json: "id"`
	Content string `json: "content"`
}

type answer struct {
	Id int `json: "id"`
	//The reason why the content is sliced is that
	//there may be more than one blanks in one cloze question
	Content []string `json: "content"`
}

type paper struct {
	name           string
	questions      []question
	answers        []answer
	questionNumber int
}

type front struct {
	Questions []question `json: "questions"`
	Answers   []answer   `json: "answers"`
}

func parseYuQueBank(content string) *paper {
	result := strings.Fields(content)
	var p paper
	p.questions = make([]question, 0)
	p.answers = make([]answer, 0)
	var q question
	var a answer
	var t string
	reg1 := regexp.MustCompile("[0-9]+>")
	reg2 := regexp.MustCompile("[0-9]+")

	//parse yuque document's content and save to custom structure
	for i, v := range result {
		switch v {
		case "问题":
			t = v
		case "答案":
			t = v
		case "考题数量":
			t = v
		}

		switch t {
		case "问题":
			if reg1.MatchString(v) {
				q.Id, _ = strconv.Atoi(reg2.FindString(v))
				content := result[i+1]
				if strings.HasSuffix(content, "<br") {
					q.Content = strings.TrimSuffix(content, "<br")
				} else {
					q.Content = result[i+1]
				}
				p.questions = append(p.questions, q)
			}

		case "答案":
			if reg1.MatchString(v) {
				a.Id, _ = strconv.Atoi(reg2.FindString(v))

				content := result[i+1]
				if strings.HasSuffix(content, "<br") {
					content = strings.TrimSuffix(content, "<br")
					if strings.Contains(content, "，") {
						a.Content = append(a.Content, strings.Split(content, "，")...)
					} else {
						a.Content = append(a.Content, content)
					}
				} else {
					if strings.Contains(content, "，") {
						a.Content = append(a.Content, strings.Split(content, "，")...)
					} else {
						a.Content = append(a.Content, content)
					}
				}
				p.answers = append(p.answers, a)
				//init a.Content
				a.Content = nil
			}

		case "考题数量":
			p.questionNumber, _ = strconv.Atoi(reg2.FindString(result[i+1]))
			return &p
		}
	}

	return &p
}

func generateQuestionBank(total, randNumber int) []int {
	slice := make([]int, 0)
	rand.Seed(time.Now().UnixNano())

	for len(slice) < randNumber {
		num := rand.Intn(total) + 1

		//Duplicate checking
		flag := true
		for _, v := range slice {
			if v == num {
				flag = false
				break
			}
		}

		if flag {
			slice = append(slice, num)
		}
	}
	return slice
}

func DocDetail(w http.ResponseWriter, req *http.Request) {
	token := os.Getenv("token")
	namespace := "my-sakura/chaos"
	slug := "bd8wks"

	var a answer
	var q question

	doc := api.GetDocumentInfo(token, namespace, slug)
	//parse yuque document's content and save to custom structure
	p := parseYuQueBank(doc.Data.Body)

	p.name = doc.Data.Title

	//Get the serial number of randomly selected questions in the question bank
	ids := generateQuestionBank(len(p.questions), p.questionNumber)

	//Generating JSON formats
	var f front
	f.Answers = make([]answer, 0)
	f.Questions = make([]question, 0)
	for i, id := range ids {
		q.Id = i + 1
		q.Content = p.questions[id-1].Content
		a.Id = i + 1
		a.Content = p.answers[id-1].Content
		f.Questions = append(f.Questions, q)
		f.Answers = append(f.Answers, a)
		// fmt.Fprintf(w, "第%d题: %s\n答案: %s\n", i+1, p.questions[id-1].Content, p.answers[id-1].Content)

	}

	data, err := json.Marshal(f)
	if err != nil {
		fmt.Println(err)
	}

	w.Header().Set("content-type", "text/json")
	w.Write(data)
}
