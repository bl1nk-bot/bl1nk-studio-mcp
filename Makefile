.PHONY: all check test lint fmt clean build release setup hooks help

all: fmt lint test_check

check:
	@echo "Override with project check command"

test:
	@echo "Override with project test command"

test_check:
	pnpm run test

lint:
	@echo "Override with project lint command"

fmt:
	@echo "Override with project format command"

clean:
	pnpm run clean:all

build:
	pnpm run build

release:
	@echo "Add release flow"

setup:
	bash scripts/setup.sh

hooks:
	cp scripts/pre-commit .husky/pre-commit && chmod +x .husky/pre-commit

help:
	@echo "Available targets:"
	@echo "  all       - fmt + lint + test_check"
	@echo "  check     - project-specific check"
	@echo "  test      - project-specific test"
	@echo "  lint      - project-specific lint"
	@echo "  fmt       - project-specific format check"
	@echo "  clean     - project-specific clean"
	@echo "  build     - project-specific build"
	@echo "  release   - project-specific release build"
	@echo "  setup     - run scripts/setup.sh"
	@echo "  hooks     - install pre-commit hook"
