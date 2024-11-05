HOW TO USE

from site root - i.e. /ss/sites/project

run this command:

	node webpack <action> <mode> <app>


action: possible values: run or watch
	
		run: 	create build once
		watch:	create build, start watching for changes AND boot up webpack-dev-server -> doesnt create file itself - serves it into memory for DEVELPMENT, to have final fila, use run

mode: possible values: dev or prod                  default dev
app: possible values: system, souls, ...			default system // ONLY FOR SYSTEM and SOULS ... rest of apps have its own webpack in their respective folders

TL;DR

node webpack run            - DO NOT USE
node webpack run prod       - prod desktop

node webpack watch		    - USE FOR DEVELOPMENT

node webpack watch prod		- DO NOT USE

REGULAR

node webpack run prod counter
node webpack watch dev counter

PORT REFERENCE
4333 = opajda; 					- own webpack in SITES/opajda
4334 = fiby; 					- own webpack in SITES/fiby
4335 = ss-system; 
4337 = ss-souls = ss-system
4336 = ss-actilog;  			- own webpack in SITES/sheo/apps/actilag
4338 = moonblocks; 				- own webpack in SITES/moonblocks