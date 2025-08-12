https://yeahlowflicker.com/blog/implementing-code-syntax-highlight-to-markdown-it

## Docker

### Production

Build and run the production image with nginx:

```bash
docker build -t knowledge-base .
docker run -p 8080:80 knowledge-base
```

The site will be available at http://localhost:8080.

### Development

```bash
docker-compose up
```

The dev server will be available at http://localhost:3000 with hot reload.
