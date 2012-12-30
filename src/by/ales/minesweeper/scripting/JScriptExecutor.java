package by.ales.minesweeper.scripting;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public final class JScriptExecutor {

	private String initScriptFilename;
	private String jsDir = "";
	private final String executorVar;
	
	private ScriptEngine engine;
	private Set<String> executedIds = new HashSet<String>(); //as value use source id (filename, url, etc)
	
	public JScriptExecutor(String initScriptFilename, String executorVar) {
		this.initScriptFilename = initScriptFilename;
		this.executorVar = executorVar;
	}
	
	public JScriptExecutor(String initScriptFilename) {
		this(initScriptFilename, "$");
	}
	
	public JScriptExecutor() {
		this(null);
	}
	
	public void setJsDir(String jsDir) {
		this.jsDir = jsDir;
	}
	
	public String getJsDir() {
		return jsDir;
	}
	
	public ScriptEngine getEngine() {
		if (engine == null) {
			this.engine = 
				new ScriptEngineManager().getEngineByName("JavaScript");
			engine.getBindings(ScriptContext.ENGINE_SCOPE).put(executorVar, this);
		}
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
			if (initScriptFilename != null && !initScriptFilename.equals("")) {
				executeFile(initScriptFilename);
			}
		}
		try {
			executedIds.add(filename);
			getEngine().put(ScriptEngine.FILENAME, filename);

			String file = jsDir + "/" + filename;
			InputStream stream = getClass().getResourceAsStream(file);
			if (stream == null) throw new FileNotFoundException(file);
			return getEngine().eval(
				new BufferedReader(new InputStreamReader(stream)));
		} catch (Exception e) {
			throw new ScriptException(e);
		}
	}
	
	public void debug(Object info) {
		System.out.printf("[DEBUG] %s\n", info);
	}
	
}
