import random
import time

import uvicorn


def main():
    random.seed(time.time())
    uvicorn.run(app="api.app:create_app", host="0.0.0.0", port=8080)


if __name__ == "__main__":
    main()
