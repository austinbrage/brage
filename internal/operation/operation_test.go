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

func TestCopyFile(t *testing.T) {
	testDir := t.TempDir()
	srcPath := filepath.Join(testDir, "source.txt")
	destPath := filepath.Join(testDir, "dest.txt")

	content := []byte("hello world")
	os.WriteFile(srcPath, content, 0644)

	if err := CopyFile(srcPath, destPath); err != nil {
		t.Fatalf("CopyFile failed: %v", err)
	}

	data, err := os.ReadFile(destPath)
	if err != nil {
		t.Fatalf("Failed to read dest file: %v", err)
	}

	if string(data) != string(content) {
		t.Fatalf("Expected %q, got %q", content, data)
	}

	// Check permissions match
	srcInfo, _ := os.Stat(srcPath)
	destInfo, _ := os.Stat(destPath)
	if srcInfo.Mode() != destInfo.Mode() {
		t.Fatalf("Expected mode %v, got %v", srcInfo.Mode(), destInfo.Mode())
	}
}