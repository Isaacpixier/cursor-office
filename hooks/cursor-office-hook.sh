#!/bin/bash
STATE_FILE="/tmp/cursor-office-state.json"
input=$(cat)
event=$(echo "$input" | grep -o '"hook_event_name":"[^"]*"' | head -1 | cut -d'"' -f4)

case "$event" in
  preToolUse)
    tool=$(echo "$input" | grep -o '"tool_name":"[^"]*"' | head -1 | cut -d'"' -f4)
    case "$tool" in
      Read|Glob|SemanticSearch|Grep) activity="reading" ;;
      Write|StrReplace|EditNotebook|Delete) activity="editing" ;;
      Shell) activity="running" ;;
      Task) activity="phoning" ;;
      *) activity="typing" ;;
    esac
    printf '{"activity":"%s","tool":"%s","ts":%d}\n' "$activity" "$tool" "$(date +%s)" > "$STATE_FILE"
    ;;
  subagentStart)
    printf '{"activity":"phoning","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
    ;;
  subagentStop)
    printf '{"activity":"typing","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
    ;;
  stop)
    status=$(echo "$input" | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
    case "$status" in
      completed)
        printf '{"activity":"celebrating","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
        ;;
      error)
        printf '{"activity":"error","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
        ;;
      *)
        printf '{"activity":"idle","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
        ;;
    esac
    ;;
  beforeSubmitPrompt)
    printf '{"activity":"idle","ts":%d}\n' "$(date +%s)" > "$STATE_FILE"
    ;;
esac

exit 0
