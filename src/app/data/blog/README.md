# Blog posts

One Markdown file per post. The file name is the URL:
`my-first-post.md` → `/blog/my-first-post`.

Start every file with front matter:

```md
---
title: My first post
date: 2026-10-18
excerpt: One or two sentences shown on the blog list.
tags: IEEE, Robotics
cover: images/my-first-post.jpg
draft: false
---

Post body in normal Markdown…
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | |
| `date` | yes | `YYYY-MM-DD`; posts sort newest first |
| `excerpt` | no | shown on the list page |
| `tags` | no | comma-separated; become filter chips |
| `cover` | no | image path relative to this folder |
| `draft` | no | `true` = visible in `npm run dev` only, hidden from the live site |

Images: put them in `images/` here and reference them relatively,
e.g. `![Team at ICRA](images/icra.jpg)`. Full URLs work too.

This README is not published as a post.
