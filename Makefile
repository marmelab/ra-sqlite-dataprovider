.PHONY: install start run deploy

help:
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## install node dependencies
	npm install

start: ## start webpack dev server
	npm run start

run: ## alias for start
	@${MAKE} start

deploy: ## deploy ra application to github page
	npm run deploy
