#!/bin/bash
set -e

TODO_DIR=".work-items/04-tasks/todo"
DONE_DIR=".work-items/04-tasks/done"

build_prompt() {
  local file="$1"
  echo "read file @$file
- check for blockers: a task is blocked if it references other tasks that are not in @$DONE_DIR
- if it is not blocked: do what is described, when all requirements pass (lint, tests, build, etc.) move the task file to @$DONE_DIR then commit
- if it is blocked: skip it"
}

for file in "$TODO_DIR"/*.md; do
  [ -f "$file" ] || continue
  echo "Processing: $file"
  prompt=$(build_prompt "$file")
  zsh -cie "copilot-ralph -p \"$prompt\""
done
