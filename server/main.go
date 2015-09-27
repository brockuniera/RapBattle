package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"sync"

	"golang.org/x/net/websocket"
)

type MutFile struct {
	sync.Mutex
	f *os.File
}

var f MutFile

func Echo(ws *websocket.Conn) {
	// var b []byte
	// websocket.Message.Receive(ws, &b)
	// log.Printf("Message: %v", string(b))
	data, err := ioutil.ReadAll(ws)
	if err != nil {
		log.Panic(err)
	}
	f.Lock()
	_, err = f.f.Write(data)
	if err != nil {
		log.Fatal(err)
	}
	f.f.Sync()
	f.Unlock()
	ws.Write(data)
	ws.Close()
}

func filewrite(ws *websocket.Conn) {
	bytes, err := ioutil.ReadAll(ws)
	if err != err {
		log.Fatalf("failed to read socket", err)
	}
	log.Printf("read %v bytes", len(bytes))
	ioutil.WriteFile("outfile", bytes, 0600)
	if err != nil {
		log.Fatalf("copy write failed", err)
	}
}

func main() {
	file, err := os.OpenFile("./datadump", os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()
	f = MutFile{sync.Mutex{}, file}

	http.Handle("/echo", websocket.Handler(Echo))
	http.Handle("/sendfile", websocket.Handler(filewrite))
	log.Printf("Ready to go...")
	err = http.ListenAndServe(":12345", nil)
	if err != nil {
		panic("ListenAndServe: " + err.Error())
	}
}
