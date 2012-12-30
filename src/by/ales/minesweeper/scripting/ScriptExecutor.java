package by.ales.minesweeper.scripting;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.Set;
import java.util.TreeSet;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;

public final class ScriptExecutor {

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
	
	protected boolean firstExec = true;
	
	private Object executeFile(String filename) throws ScriptException {
		if (firstExec) {
			firstExec = false;
			executeFile("prepare.js");
		}
		try {
			executedIds.add(filename);
			getEngine().put(ScriptEngine.FILENAME, filename);
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
