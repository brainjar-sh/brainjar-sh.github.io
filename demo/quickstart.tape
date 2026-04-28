# Quickstart demo for brainjar.sh.
# Renders to public/quickstart.gif, embedded on the landing page.
#
# To record:
#   1. Install VHS:           brew install vhs
#                             (or: go install github.com/charmbracelet/vhs@latest)
#   2. Install brainjar and put it on PATH.
#   3. From the repo root:    npm run demo
#
# All environment setup lives in demo/setup.sh.

Output public/quickstart.gif

Set FontSize 18
Set Width 1100
Set Height 600
Set TypingSpeed 50ms
Set PlaybackSpeed 1.0

# Phosphor — tasteful CRT-green palette. Dark background with a slight green
# tint, soft sage foreground (not neon), muted ANSI accents in the same family.
Set Theme { "name": "Phosphor", "background": "#0a0f0a", "foreground": "#a8d8a8", "cursor": "#9be09b", "selection": "#1f3f1f", "black": "#0f1410", "red": "#c97a7a", "green": "#9be09b", "yellow": "#c5c47a", "blue": "#7faecc", "magenta": "#a888c0", "cyan": "#7fc8b8", "white": "#b8c8b8", "brightBlack": "#3a4a3a", "brightRed": "#e09494", "brightGreen": "#bff0bf", "brightYellow": "#dcdc94", "brightBlue": "#9bc8e0", "brightMagenta": "#c8a4d8", "brightCyan": "#9be0d0", "brightWhite": "#d8e0d8" }

Hide
Type "source demo/setup.sh"
Enter
Sleep 200ms
Type "clear"
Enter
Sleep 200ms
Show

# Run the canonical install line: banner and progress bar play out, the binary
# lands in $INSTALL_DIR (a throwaway dir set in setup.sh).
Type "curl -fsSL https://get.brainjar.sh/brainjar/install.sh | sh"
Enter
Sleep 2s

Hide
Type "clear"
Enter
Sleep 200ms
Show

Type "brainjar init"
Enter
Sleep 1000ms

Type "brainjar persona use reviewer"
Enter
Sleep 800ms

Type "brainjar status --short"
Enter
Sleep 1800ms
