package main

import (
	"fmt"
	_ "net/http/pprof"

	"github.com/my-Sakura/go-yuque-api/api"
)

func main() {
	namespace := "my-sakura/project"
	slug := "puve7x"
	doc := api.GetDocumentInfo("YLN7hYz4iKmWSs1MfyLDrNY2IqZaM2ZabOOmpIAX", namespace, slug)
	fmt.Println(doc.Data.Body)
}
