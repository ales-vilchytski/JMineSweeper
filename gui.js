$.include('sweeper.js')
$.include('ui.js')

var SwingGui = new JavaImporter(
	java.awt.FlowLayout,
	java.awt.GridLayout,
	javax.swing,
    javax.swing.event,
    javax.swing.border,
    java.awt.event);
    
with(SwingGui) {
	
	var frame = new JFrame();
	frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	
	var fileMenu = new JMenu('file');
	fileMenu.add(new JMenuItem('file'));
	fileMenu.setSize(20, 30);
	
	var menuBar = new JMenuBar();
	menuBar.setLayout(new FlowLayout(FlowLayout.LEFT));
	menuBar.add(fileMenu);
	
	frame.setJMenuBar(menuBar);
	frame.setLayout(new GridLayout(3,3));
	var ui = new UI();
	var sweeper = new Sweeper(3,3, 2, ui);
	
	frame.setContentPane(ui.getPanel());
	
	frame.show();
}

