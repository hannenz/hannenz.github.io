SASSC=gsassc

SASSDIR=sass
CSSDIR=css

SASS_SOURCES=$(wildcard sass/*.scss) $(wildcard sass/partials/*.scss) $(wildcard sass/lib/*.scss)

css/styles.css:	$(SASS_SOURCES)
	$(SASSC) -t compressed -g -o $@ $<
