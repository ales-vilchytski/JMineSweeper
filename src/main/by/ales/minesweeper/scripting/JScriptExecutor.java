package by.ales.minesweeper.scripting;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Set;

import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public final class JScriptExecutor {

	private String jsDir = "";
	private final String executorVar;
	
	private ScriptEngine engine;
	private Set<String> executedIds = new HashSet<String>(); //as value use source id (filename, url, etc)
	
	public JScriptExecutor(String executorVar) {
		this.executorVar = executorVar;
	}
	
	public JScriptExecutor() {
		this("$");
	}
	
	public void setJsDir(String jsDir) {
		this.jsDir = jsDir;
	}
	
	public String getJsDir() {
		return jsDir;
	}
	
	public String getExecutorVar() {
		return executorVar;
	}
	
	public ScriptEngine getEngine() {
		if (engine == null) {
			this.engine = 
				new ScriptEngineManager().getEngineByName("JavaScript");
			engine.getBindings(ScriptContext.ENGINE_SCOPE).put(executorVar, this);
		}
		return engine;
	}
	
	public Object execute(String id, InputStream source) throws ScriptException {
		try {
			getEngine().put(ScriptEngine.FILENAME, id);

			Object res = getEngine().eval(
				new BufferedReader(new InputStreamReader(source)));
			executedIds.add(id);
			return res;
		} catch (Exception e) {
			throw new ScriptException(e);
		}
	}
	
	private String idFromRelPath(String relPath) {
		return jsDir + "/" + relPath;
	}
	
	public Object execute(String relPath) throws ScriptException {
		String file = idFromRelPath(relPath);
		InputStream stream = getClass().getResourceAsStream(file);
		if (stream == null) {
			throw new ScriptException("File not found - " + file);
		}
		try {
			return execute(file, stream);
		} catch (Exception e) {
			throw new ScriptException(e);
		}
	}
	
	private String idFromFile(File source) {
		return source.getPath();
	}
	
	public Object execute(File source) throws ScriptException {
		try {
			return execute(idFromFile(source), new FileInputStream(source));
		} catch (FileNotFoundException e) {
			throw new ScriptException(e);
		}
	}
	
	public void include(String id, InputStream source) throws ScriptException {
		if (!executedIds.contains(id)) {
			execute(id, source);
		}
	}
	
	public void include(String relPath) throws ScriptException {
		if (!executedIds.contains(idFromRelPath(relPath))) {
			execute(relPath);
		}
	}
	
	public void include(File source) throws ScriptException {
		if (!executedIds.contains(idFromFile(source))) {
			execute(source);
		}
	}
	
	public void debug(Object info) {
		System.out.printf("[DEBUG] %s\n", info);
	}
}
