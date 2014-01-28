#!/bin/bash

# #############################
# Collect scripts
# #############################

cat header.js > script.js

for OUTPUT in $(/usr/bin/perl -lne '/<script src=\"(.*)\"/ and print "$1"' compile.html)
do
	echo "" >> script.js
	echo "" >> script.js
	echo "/* **************************************************************************************************** */" >> script.js
	echo "/* ${OUTPUT} */" >> script.js
	echo "/* **************************************************************************************************** */" >> script.js
	echo "" >> script.js
	cat "../${OUTPUT}" >> script.js
done

if [[ "$1" == "closure" ]]; then
	# #############################
	# Minify with google
	# #############################
	in=script.js
	out=script.compile.js

	curl -s \
		-d compilation_level=SIMPLE_OPTIMIZATIONS \
		-d output_format=text \
		-d output_info=compiled_code \
		--data-urlencode "js_code@${in}" \
		http://closure-compiler.appspot.com/compile \
		> $out
else
	# #############################
	# Minify with node
	# #############################
	minify script.js script.compile.js
fi

cat header.js > script.min.js
cat script.compile.js >> script.min.js
rm script.compile.js

# #############################
# Styles
# #############################

cat header.css > styles.css

for OUTPUT in $(/usr/bin/perl -lne '/<link rel=\"stylesheet\" href=\"(.*)\"/ and print "$1"' compile.html)
do
	cat "../${OUTPUT}" >> styles.css
done

minify styles.css styles.compile.css
cat header.css > styles.min.css
cat styles.compile.css >> styles.min.css

rm styles.compile.css