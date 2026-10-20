# Music for Murmur

Murmur, the music player on the desktop, plays whatever is listed in `tracks.json`, followed by the built-in hold music.

1. Put audio files in this folder (MP3, OGG, M4A or WAV; anything the browser can play).
2. List them in `tracks.json`, in play order:

```json
[
  { "title": "Morning Standup", "artist": "Stillwater Sound", "file": "morning-standup.mp3" },
  { "title": "Calm Is a Deliverable", "artist": "Stillwater Sound", "file": "calm-is-a-deliverable.ogg" }
]
```

`file` is relative to this folder. File names may use letters, numbers, spaces and `. _ - ( ) & '`. If the list is missing or empty, Murmur only has the hold music.
