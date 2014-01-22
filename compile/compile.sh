#!/bin/bash

cat header.js > demo.js

for OUTPUT in $(/usr/bin/perl -lne '/<script src=\"(.*)\"/ and print "$1"' compile.html)
do
	echo $OUTPUT
	minify "../${OUTPUT}" "compile/${OUTPUT##*/}"
	echo "" >> demo.js
	echo "" >> demo.js
	echo "/* **************************************************************************************************** */" >> demo.js
	echo "/* ${OUTPUT} */" >> demo.js
	echo "/* **************************************************************************************************** */" >> demo.js
	echo "" >> demo.js
	cat "compile/${OUTPUT##*/}" >> demo.js
done

minify demo.js demo.compile.js

#curl -s \
#	-d compilation_level=SIMPLE_OPTIMIZATIONS \
#	-d output_format=text \
#	-d output_info=compiled_code \
#	--data-urlencode "js_code@${in}" \
#	http://closure-compiler.appspot.com/compile \
#	> script.compile.js

cat header.js > demo.min.js
cat demo.compile.js >> demo.min.js

cat header.css > demo.css

for OUTPUT in $(/usr/bin/perl -lne '/<link rel=\"stylesheet\" href=\"(.*)\"/ and print "$1"' compile.html)
do
	echo $OUTPUT
	cat "../${OUTPUT}" >> demo.css
done

minify demo.css demo.compile.css
cat header.css > demo.min.css
cat demo.compile.css >> demo.min.css

rm demo.compile.js
rm demo.compile.css
