from flask import Flask, jsonify, request


def create_app() -> Flask:
    app = Flask(__name__)

    @app.get("/health")
    def health() -> tuple:
        return jsonify(status="ok"), 200

    @app.get("/")
    def index() -> tuple:
        return jsonify(service="Text Wrecker Backend", status="ok"), 200

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


