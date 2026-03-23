build:
	export BAKER_OUTPUT=docs/ && npm run-script build
	npx pagefind --site docs/
	echo 'cummings.ee' > docs/CNAME
	touch docs/.nojekyll
	echo 'encoding: UTF-8' > docs/_config.yml

.PHONY: build
