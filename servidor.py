#!/usr/bin/env python3
"""
BERNARDO RAMOS — PORTFOLIO V3 · servidor local de teste
Serve TODO o site (site + todas as demos) num servidor único e estatico.

Uso:
    python servidor.py            # porta 8080
    python servidor.py 5000       # porta customizada

Abra: http://localhost:8080
Para publicar: nao precisa do Python. Basta subir esta pasta inteira
num host estatico (Netlify / Vercel / GitHub Pages). Veja README.md.
"""
import http.server, json, os, sys, webbrowser
from functools import partial
from urllib.parse import urlparse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
ROOT = os.path.dirname(os.path.abspath(__file__))
VANT_ROOT = os.path.join(ROOT, "demos", "vant")
VANT_PAGES = {
    "/galeria": "galeria.html",
    "/skills": "skills.html",
    "/chat": "chat.html",
    "/precos": "precos.html",
    "/painel": "painel.html",
    "/entrar": "entrar.html",
    "/criar-conta": "criar-conta.html",
    "/verificar": "verificar.html",
    "/admin": "admin.html",
}
VANT_USER = {
    "id": 1,
    "nome": "Bernardo Ramos",
    "email": "demo@vant.local",
    "plano": "pro",
    "plano_nome": "Pro",
    "pontos": 1280,
    "pode_customizar": True,
    "is_admin": True,
    "codigo_ref": "BERNARDO",
    "convites_ok": 7,
}


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript", ".mjs": "application/javascript",
        ".json": "application/json", ".svg": "image/svg+xml",
        ".webp": "image/webp", ".woff2": "font/woff2", ".mp4": "video/mp4",
    }
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()
    def log_message(self, fmt, *args):
        sys.stdout.write("  \033[90m%s\033[0m  %s\n" % (self.log_date_time_string(), fmt % args))

    def _send_json(self, body, status=200):
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def _send_file(self, path, download_name=None):
        if not os.path.isfile(path):
            self.send_error(404, "Nao encontrado")
            return
        ctype = self.guess_type(path)
        size = os.path.getsize(path)
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(size))
        if download_name:
            self.send_header("Content-Disposition", f'attachment; filename="{download_name}"')
        self.end_headers()
        if self.command != "HEAD":
            with open(path, "rb") as f:
                self.wfile.write(f.read())

    def _read_body(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
            raw = self.rfile.read(n) if n else b"{}"
            return json.loads(raw.decode("utf-8"))
        except Exception:
            return {}

    def _vant_gallery(self):
        idx = os.path.join(VANT_ROOT, "exemplos", "index.json")
        try:
            with open(idx, encoding="utf-8") as f:
                exemplos = json.load(f)
        except Exception:
            exemplos = []
        return exemplos

    def _vant_get(self, path):
        if path.startswith("/static/"):
            rel = path[len("/static/"):].lstrip("/")
            safe = os.path.normpath(os.path.join(VANT_ROOT, "static", rel))
            if safe.startswith(os.path.join(VANT_ROOT, "static")):
                self._send_file(safe)
                return True
        if path.startswith("/exemplo/"):
            name = os.path.basename(path)
            self._send_file(os.path.join(VANT_ROOT, "exemplos", name))
            return True
        if path.startswith("/deck/"):
            name = os.path.basename(path)
            self._send_file(os.path.join(VANT_ROOT, "exemplos", name))
            return True
        if path in VANT_PAGES:
            self._send_file(os.path.join(VANT_ROOT, VANT_PAGES[path]))
            return True
        if path == "/api/eu":
            self._send_json({"ok": True, "logado": True, "usuario": VANT_USER})
            return True
        if path == "/api/galeria":
            self._send_json({"ok": True, "exemplos": self._vant_gallery()})
            return True
        if path == "/api/skills":
            self._send_json({"ok": True, "skills": [
                {"id": "liquid-glass-deck", "nome": "Apresentações Liquid Glass", "tagline": "Vire um tema em slides de cinema.", "descricao": "Decks HTML editáveis com estética premium.", "icone": "deck", "destaque": True, "disponivel": True, "entrega": ["Arquivo HTML", "10 identidades visuais", "Modo edição"], "ordem": 1},
                {"id": "carrossel", "nome": "Carrossel para Instagram", "tagline": "Carrosséis que param o dedo.", "descricao": "Em breve.", "icone": "carousel", "destaque": False, "disponivel": False, "entrega": ["10 lâminas", "Capa magnética"], "ordem": 2},
            ]})
            return True
        if path == "/api/pontos":
            self._send_json({"ok": True, "saldo": VANT_USER["pontos"], "historico": [], "custos": {"roteiro": 5, "geracao": 20, "download": 40, "skill": 300}})
            return True
        if path == "/api/minhas-geracoes":
            self._send_json({"ok": True, "geracoes": []})
            return True
        if path == "/api/convites":
            self._send_json({"ok": True, "codigo": "BERNARDO", "link": f"http://localhost:{PORT}/r/BERNARDO", "convites_ok": 7, "pontos_ganhos": 520, "proximo_bonus": 160, "bonus_convidado": 100, "bonus_nivel2": 30, "convidados": []})
            return True
        if path.startswith("/api/download/"):
            demo = os.path.join(VANT_ROOT, "exemplos", "03-plano-de-marketing-2026.html")
            self._send_file(demo, "apresentacao-vant-demo.html")
            return True
        if path.startswith("/api/admin/"):
            self._send_json({"ok": True, "kpis": {}, "funil": [], "serie": [], "usuarios": [], "cupons": [], "eventos": [], "config": {}, "skills": []})
            return True
        return False

    def _vant_post(self, path):
        body = self._read_body()
        if path in ("/api/registrar", "/api/verificar", "/api/entrar", "/api/upgrade", "/api/comprar", "/api/cupom", "/api/customizar-skill"):
            self._send_json({"ok": True, "usuario": VANT_USER, "saldo": VANT_USER["pontos"], "codigo_dev": "2026", "admin": True})
            return True
        if path == "/api/sair":
            self._send_json({"ok": True})
            return True
        if path == "/api/chat":
            tema = (body.get("mensagem") or "apresentação estratégica").strip()
            slides = [
                {"n": 1, "tipo": "Capa", "titulo": "A oportunidade"},
                {"n": 2, "tipo": "Tensão", "titulo": "O problema que custa caro"},
                {"n": 3, "tipo": "Números", "titulo": "O tamanho do mercado"},
                {"n": 4, "tipo": "Resolução", "titulo": "A solução proposta"},
                {"n": 5, "tipo": "Fecho", "titulo": "Próximo passo"},
            ]
            self._send_json({
                "ok": True,
                "thinking": ["Lendo o briefing", "Estruturando narrativa", "Escolhendo identidade visual"],
                "resposta": "Montei um roteiro com abertura forte, tensão clara e fechamento executivo. Pode aprovar para gerar a apresentação.",
                "acao": "roteiro",
                "custo": 5,
                "saldo": VANT_USER["pontos"] - 5,
                "roteiro_info": {
                    "tema": tema,
                    "titulo": "Deck estratégico Vant",
                    "n_slides": len(slides),
                    "dominio": "Negócios",
                    "arco": "Problema -> Prova -> Solução",
                    "publico": "Executivo",
                    "objetivo": "Convencer e alinhar decisão",
                    "cor": "vant",
                    "slides": slides,
                    "fontes": [{"nome": "McKinsey", "url": "https://www.mckinsey.com/"}, {"nome": "Think with Google", "url": "https://www.thinkwithgoogle.com/"}],
                },
            })
            return True
        if path == "/api/gerar":
            self._send_json({
                "ok": True,
                "id": 1,
                "titulo": "Plano de marketing 2026",
                "n_slides": 9,
                "dominio": "Marketing",
                "cor": "sunset",
                "cor_nome": "Cartaz",
                "preview_url": "/exemplo/03-plano-de-marketing-2026.html",
                "marca_dagua": False,
                "liberado": True,
                "custo_download": 0,
                "saldo": VANT_USER["pontos"] - 25,
            })
            return True
        return False

    def do_GET(self):
        path = urlparse(self.path).path
        if self._vant_get(path):
            return
        super().do_GET()

    def do_POST(self):
        path = urlparse(self.path).path
        if self._vant_post(path):
            return
        self._send_json({"ok": False, "erro": "Rota nao encontrada"}, 404)

    def do_HEAD(self):
        self.do_GET()


def main():
    os.chdir(ROOT)
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), partial(Handler, directory=ROOT)) as httpd:
        url = f"http://localhost:{PORT}"
        print("\n" + "=" * 60)
        print("   BERNARDO RAMOS — PORTFOLIO V3   ·   servidor local")
        print("=" * 60)
        print(f"   Rodando em:  {url}")
        print(f"   Pasta:       {ROOT}")
        print("   Parar:       Ctrl + C")
        print("=" * 60 + "\n")
        try: httpd.serve_forever()
        except KeyboardInterrupt: print("\n  Servidor encerrado.\n")


if __name__ == "__main__":
    main()
