package ordjagt

import (
	"crypto/sha1"
	"encoding/hex"

	"github.com/rs/zerolog/log"
)

func calcsha1(input string) string {
	log.Debug().Str("input", input).Msg("calcsha1")
	h := sha1.New()
	h.Write([]byte(input))
	return hex.EncodeToString(h.Sum(nil))
}
