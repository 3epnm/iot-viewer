#!/bin/bash

# #############################
# Collect demos
# #############################

cat header.js > demo.js

for OUTPUT in $(/usr/bin/perl -lne '/<script src=\"(.*)\"/ and print "$1"' compile.html)
do
	echo "" >> demo.js
	echo "" >> demo.js
	echo "/* **************************************************************************************************** */" >> demo.js
	echo "/* ${OUTPUT} */" >> demo.js
	echo "/* **************************************************************************************************** */" >> demo.js
	echo "" >> demo.js
	cat "../${OUTPUT}" >> demo.js
done

if [[ "$1" == "closure" ]]; then
	# #############################
	# Minify with google
	# #############################
	in=demo.js
	out=demo.compile.js

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
	minify demo.js demo.compile.js
fi

cat header.js > demo.min.js
cat demo.compile.js >> demo.min.js
rm demo.compile.js

# #############################
# demos
# #############################

cat header.css > demo.css

for OUTPUT in $(/usr/bin/perl -lne '/<link rel=\"stylesheet\" href=\"(.*)\"/ and print "$1"' compile.html)
do
	cat "../${OUTPUT}" >> demo.css
done

minify demo.css demo.compile.css
cat demo.compile.css >> demo.min.css

rm demo.compile.css