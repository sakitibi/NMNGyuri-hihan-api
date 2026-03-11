package main

import (
	"fmt"
	"os"
	"os/exec"
	"time"
)

func writeLog(message string) {
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	f, _ := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	defer f.Close()
	f.WriteString(fmt.Sprintf("[%s] %s\n", timestamp, message))
}

func playSoundAsync(filePath string) {
	go func() {
		exec.Command("afplay", filePath).Run()
	}()
}

func macNotify(title, message string) {
	script := fmt.Sprintf("display notification \"%s\" with title \"%s\"", message, title)
	exec.Command("osascript", "-e", script).Run()
}
