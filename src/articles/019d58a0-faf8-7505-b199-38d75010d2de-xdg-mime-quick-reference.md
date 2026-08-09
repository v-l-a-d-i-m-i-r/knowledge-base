---
title: xdg-mime Quick Reference
tags:
  - xdg-mime
  - mime-types
  - linux
  - applications
  - file-association
  - reference
date: 04-04-2026
---

# xdg-mime Quick Reference

`xdg-mime` is used to **query and set default applications** for MIME
types and URL schemes.\
This is what `xdg-open` relies on.

---

## 🔍 Check what app is currently used

### Check default app for a file type

```bash
xdg-mime query default application/pdf
xdg-mime query default image/png
xdg-mime query default text/plain
```

### Check default browser (URL handlers)

```bash
xdg-mime query default x-scheme-handler/http
xdg-mime query default x-scheme-handler/https
```

### Check default file manager

```bash
xdg-mime query default inode/directory
```

---

## 📦 Find the `.desktop` file name of an app

```bash
ls /usr/share/applications | grep -i firefox
ls /usr/share/applications | grep -i okular
```

You will get names like:

    firefox.desktop
    org.kde.okular.desktop
    org.gnome.Nautilus.desktop

---

## ✅ Set a default application

### Set Firefox as default browser

```bash
xdg-mime default firefox.desktop x-scheme-handler/http
xdg-mime default firefox.desktop x-scheme-handler/https
```

### Set Okular as default PDF viewer

```bash
xdg-mime default org.kde.okular.desktop application/pdf
```

### Set Nautilus as default file manager

```bash
xdg-mime default org.gnome.Nautilus.desktop inode/directory
```

---

## 🧠 Common MIME types

File Type MIME Type

---

PDF `application/pdf`
PNG image `image/png`
JPEG image `image/jpeg`
Text file `text/plain`
HTML file `text/html`
Directory `inode/directory`

---

## 🗂 Where settings are stored

User config (most important):

    ~/.config/mimeapps.list

System defaults:

    /usr/share/applications/mimeapps.list

Example content:

```ini
[Default Applications]
application/pdf=org.kde.okular.desktop
x-scheme-handler/http=firefox.desktop
x-scheme-handler/https=firefox.desktop
inode/directory=org.gnome.Nautilus.desktop
```

---

## 🐛 Debug what `xdg-open` is doing

```bash
XDG_UTILS_DEBUG_LEVEL=2 xdg-open file.pdf
```

---

## 🧪 Test your changes

```bash
xdg-open file.pdf
xdg-open https://example.com
xdg-open .
```

---

## 🧭 Tip

You never configure `xdg-open` directly.\
You configure MIME → `.desktop` mappings with `xdg-mime`.
