package by.ales.minesweeper;

import java.util.MissingResourceException;
import java.util.ResourceBundle;

import javax.script.ScriptException;

import by.ales.minesweeper.scripting.JScriptExecutor;


public class Main {

	private static final String JSDIR_KEY = "jsDir";
	private static final String MAIN_KEY = "mainscript";
	private static final String INIT_KEY = "initscript";
	private static final String VAR_KEY = "executorVar";
	
	public static void main(String[] args) throws ScriptException {
		
		//defaults
		String jsDir = "/js";
		String main = "main.js";
		String init = null;
		String var = "$";
		
		try {
			String bundleName = null;
			if (args.length > 1) {
				bundleName = args[0];
			} else {
				bundleName = "by.ales.minesweeper.settings";
			}
			ResourceBundle bundle = 
					ResourceBundle.getBundle(bundleName);
			if (bundle.containsKey(JSDIR_KEY)) {
				jsDir = bundle.getString(JSDIR_KEY);	
			}
			if (bundle.containsKey(MAIN_KEY)) {
				main = bundle.getString(MAIN_KEY);	
			}
			if (bundle.containsKey(INIT_KEY)) {
				init = bundle.getString(INIT_KEY);	
			}
			if (bundle.containsKey(VAR_KEY)) {
				var = bundle.getString(VAR_KEY);	
			}
		} catch (MissingResourceException exc) {
			exc.printStackTrace();
		}
		
		JScriptExecutor executor = new JScriptExecutor(init, var);
		executor.setJsDir(jsDir);
		executor.execute(main);
	}
}
