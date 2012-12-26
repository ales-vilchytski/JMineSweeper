package by.ales.minesweeper.scripting;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class ScriptExecutor {

	private ScriptEngine engine;
	private Set<String> executedIds = new TreeSet<String>(); //as value use source id (filename, url, etc)
	
	public ScriptExecutor(ScriptEngine engine) {
		this.engine = engine;
		engine.getBindings(ScriptContext.ENGINE_SCOPE).put("$", this);
	}
	
	public ScriptEngine getEngine() {
		return engine;
	}
	
	public Object execute(String filename) throws ScriptException {
		return executeFile(filename);
	}
	
	public void include(String filename) throws ScriptException {
		if (!executedIds.contains(filename)) {
			executeFile(filename);
		}
	}
	
	private Object executeFile(String filename) throws ScriptException {
		try {
			executedIds.add(filename);
			Object result = getEngine().eval(new FileReader(filename));
			return result;
		} catch (FileNotFoundException e) {
			throw new ScriptException(e);
		}
	}
	
	public void debug(Object info) {
		System.out.printf("[DEBUG] %s\n", info);
	}
	
}
