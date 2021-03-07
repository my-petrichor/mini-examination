package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httptest"

	"github.com/my-Sakura/mini-examination/api"
)

func main() {
	ts := httptest.NewUnstartedServer(http.HandlerFunc(api.DocDetail))
	ts.StartTLS()
	defer ts.Close()

	resp, err := ts.Client().Get(ts.URL)
	if err != nil {
		log.Fatal(err)
	}

	greeting, err := ioutil.ReadAll(resp.Body)
	resp.Body.Close()
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s\n", greeting)
}
