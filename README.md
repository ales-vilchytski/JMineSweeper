Java + JavaScript -> JMineSweeper
===============================

This is minesweeper game for Java. It bring example of use JavaScript on Java platform.
Logic and UI of game is implemented on JS using Mozilla Rhino.

There is no distribution, but dependencies are:
* mozilla Rhino 1.7
* JSExecutor - [JSExecutor](https://github.com/ales-vilchytski/JSExecutor)
* Use Ivy to resolve dependencies, but first - compile and publish JSExecutor. 
Then run 'ant dist_with_dep' to create all in one executable .jar for JMineSweeper.

P.S. There is another project which brings MineSweeper to browsers using JS + HTML on 
<a href='https://github.com/ales-vilchytski/MineSweeper'>github</a>.