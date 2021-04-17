build:
	export BAKER_OUTPUT=docs/ && npm run-script build
	echo 'cummings.ee' > docs/CNAME
	echo 'encoding: UTF-8' > docs/_config.yml

.PHONY: build
