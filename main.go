package main

import (
	"fmt"
	"os"

	"github.com/eyJhb/ordjagt/ordjagt"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func main() {
	zerolog.SetGlobalLevel(zerolog.DebugLevel)
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

	conf := ordjagt.OrdjagtConfig{
		Name:          "test",
		EncryptionKey: "WUFXamZ3WUM5aG41V1IqSSt6dzkqcld+PVdCfUMjLiMhNDtOTyYjNVkrNCtMYkk3KDV2W3s7dEB5VkNNbjUsOTZucmFfIXE5P2VHYnRS",

		BindAddress: "",
		Port:        5000,
	}
	s, _ := ordjagt.New(conf)

	log.Info().Msg(fmt.Sprintf("Starting server on %s:%d", conf.BindAddress, conf.Port))
	s.Run()
}
