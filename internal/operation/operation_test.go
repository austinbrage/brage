package operation

import (
	"os"
	"path/filepath"
	"testing"
)

func TestEmptyDir(t *testing.T) {
	testDir := t.TempDir()

	os.WriteFile(filepath.Join(testDir, "file.text"), []byte("hello"), 0644)
	os.Mkdir(filepath.Join(testDir, ".git"), 0755)

	if err := EmptyDir(testDir); err != nil {
		t.Fatal(err)
	}

	entries, err := os.ReadDir(testDir)
	if err != nil {
		t.Fatalf("Unexpected error reading directory: %v", err)
	}
	if len(entries) != 1 {
		t.Fatalf("Expected 1 entry (.git), got %d entries", len(entries))
	}
	if entries[0].Name() != ".git" || !entries[0].IsDir() {
		t.Fatalf("Expected .git folder to remain, got %s", entries[0].Name())
	}
}