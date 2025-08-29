package operation

import (
	"os"
	"path/filepath"
)

// EmptyDir: removes all files in a directory except ".git"
func EmptyDir(dir string) error {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if entry.Name() == ".git" {
			continue
		}

		err := os.RemoveAll(filepath.Join(dir, entry.Name()))
		if err != nil {
			return err
		}			
	}

	return nil
}