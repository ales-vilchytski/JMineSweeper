package by.ales.minesweeper;

import static org.junit.Assert.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import javax.script.ScriptContext;
import javax.script.ScriptException;
import org.junit.Before;
import org.junit.Test;

import by.ales.minesweeper.scripting.JScriptExecutor;

public class JScriptExecutorTest {

	protected JScriptExecutor executor = null;
	protected final String jsDir = "/js/executor_tests";
	protected final String scriptFilePrefix = "bin/tests/js/executor_tests/";
	
	@Before 
	public void setUp() {
		this.executor = new JScriptExecutor();
		executor.setJsDir(jsDir);
	}
	
	@Test
	public void testExecuteRelative() throws ScriptException {
		Object res = executor.execute("string_return.js");
		assertEquals("ok", res.toString());
	}
	
	@Test 
	public void testExecuteFile() throws ScriptException {
		File test = new File(scriptFilePrefix + "string_return.js");
		Object res = executor.execute(test);
		assertEquals("ok", res.toString());
	}
	
	@Test 
	public void testExecuteStream() throws FileNotFoundException, ScriptException {
		File test = new File(scriptFilePrefix + "string_return.js");
		Object res = executor.execute(test.getAbsolutePath(), new FileInputStream(test));
		assertEquals("ok", res.toString());
	}
	
	@Test
	public void testIncludeRelative() throws ScriptException {
		executor.getEngine().getBindings(ScriptContext.ENGINE_SCOPE).put("counter", 0);
		executor.include("count_includes.js");
		Object count = executor.getEngine().get("counter");
		assertEquals("1.0", count.toString());
	}

	@Test 
	public void testIncludeRelativeOnce() throws ScriptException {
		executor.getEngine().getBindings(ScriptContext.ENGINE_SCOPE).put("counter", 0);
		executor.include("count_includes.js");
		Object count = executor.getEngine().get("counter");
		assertEquals("1.0", count.toString());
		
		executor.include("count_includes.js");
		count = executor.getEngine().get("counter");
		assertEquals("1.0", count.toString());
	}
	
	@Test
	public void testExecuteManyTimes() throws ScriptException {
		executor.getEngine().getBindings(ScriptContext.ENGINE_SCOPE).put("counter", 0);
		executor.execute("count_includes.js");
		Object count = executor.getEngine().get("counter");
		assertEquals("1.0", count.toString());
		
		executor.execute("count_includes.js");
		count = executor.getEngine().get("counter");
		assertEquals("2.0", count.toString());
	}
	
	@Test
	public void testDefaultExecutorVar() throws ScriptException {
		JScriptExecutor executor = new JScriptExecutor();
		executor.setJsDir(jsDir);
		assertEquals("$", executor.getExecutorVar());
		
		Object res = executor.execute("test_defvar.js");
		assertEquals("ok", res.toString());
	}
	
	@Test
	public void testSetExecutorVar() throws ScriptException {
		JScriptExecutor executor = new JScriptExecutor("ExecutorVar");
		executor.setJsDir(jsDir);
		assertEquals("ExecutorVar", executor.getExecutorVar());
		
		Object res = executor.execute("test_defvar.js");
		assertNotSame("ok", res.toString());
	}
}
