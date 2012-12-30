package by.ales.minesweeper.main;

import java.io.FileNotFoundException;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import by.ales.minesweeper.scripting.ScriptExecutor;


public class Main {

	public static void main(String[] args) throws FileNotFoundException, ScriptException {
		
		ScriptEngineManager engineFactory = new ScriptEngineManager();
		ScriptEngine engine = engineFactory.getEngineByName("JavaScript");
	
		ScriptExecutor executor = new ScriptExecutor(engine);
		String filename = null;
		if (args.length == 1) {
			filename = args[0];
		} else {
			filename = "main.js";
		}
		executor.execute(filename);
	}
}
