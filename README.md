Java JSR223 + JS -> JMineSweeper
===============================

This is minesweeper game for Java 6 and later. It bring example of use JavaScript on Java platform.
Logic and UI of game is implemented on JS using Mozilla Rhino through JSR223).

To wrap JSR223 another project is used: <a href="https://github.com/ales-vilchytski/https://github.com/ales-vilchytski/JSExecutor">JSExecutor</a>

There is no distribution, but dependencies are lightweight (download JSExecutor, 
compile and publish/copy it. Then run 'ant dist_with_dep' to create all in one executable .jar).

P.S. There is another project which brings MineSweeper to browsers using JS + HTML on 
<a href='https://github.com/ales-vilchytski/MineSweeper'>github</a>.