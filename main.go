package main

import (
	"os"

	"github.com/eyjhb/ordjagt/ordjagt"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	conf := ordjagt.OrdjagtConfig{
		Name:          "test",
		EncryptionKey: "WUFXamZ3WUM5aG41V1IqSSt6dzkqcld+PVdCfUMjLiMhNDtOTyYjNVkrNCtMYkk3KDV2W3s7dEB5VkNNbjUsOTZucmFfIXE5P2VHYnRS",
	}
	s, _ := ordjagt.New(conf)
	s.Run()
}
