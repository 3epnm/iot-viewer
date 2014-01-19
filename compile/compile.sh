#!/bin/bash

cat header.js > script.js

for OUTPUT in $(/usr/bin/perl -lne '/<script src=\"(.*)\"/ and print "$1"' ../index.html)
do
	echo $OUTPUT
	minify "../${OUTPUT}" "compile/${OUTPUT##*/}"
	echo "" >> script.js
	echo "" >> script.js
	echo "/* **************************************************************************************************** */" >> script.js
	echo "/* ${OUTPUT} */" >> script.js
	echo "/* **************************************************************************************************** */" >> script.js
	echo "" >> script.js
	cat "compile/${OUTPUT##*/}" >> script.js
done

minify script.js script.compile.js

#curl -s \
#	-d compilation_level=SIMPLE_OPTIMIZATIONS \
#	-d output_format=text \
#	-d output_info=compiled_code \
#	--data-urlencode "js_code@${in}" \
#	http://closure-compiler.appspot.com/compile \
#	> script.compile.js

cat header.js > script.min.js
cat script.compile.js >> script.min.js

cat header.css > styles.css

for OUTPUT in $(/usr/bin/perl -lne '/<link rel=\"stylesheet\" href=\"(.*)\"/ and print "$1"' ../index.html)
do
	echo $OUTPUT
	cat "../${OUTPUT}" >> styles.css
done

minify styles.css styles.compile.css
cat header.css > styles.min.css
cat styles.compile.css >> styles.min.css

rm script.compile.js
rm styles.compile.css