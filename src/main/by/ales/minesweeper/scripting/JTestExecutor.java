package by.ales.minesweeper.scripting;

import java.io.File;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptException;

import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.types.FileSet;

public class JTestExecutor extends Task {

	private String options = "{}";
	private String ignoredGlobalVars = "";
	private String haltOnFirstFailure = "true";
	private String jsDir = "/js";
	private String prepareScript = null;
	private String rhinoUnitDir = "test/js/rhinounit_1_2_1";
	private List<FileSet> filesets = new LinkedList<FileSet>();
	
	public void setOptions(String opts) {
		this.options = opts;
	}

	public void setIgnoredGlobalVars(String ignoredGlobalVars) {
		this.ignoredGlobalVars = ignoredGlobalVars;
	}

	public void setHaltOnFirstFailure(String haltOnFirstFailure) {
		this.haltOnFirstFailure = haltOnFirstFailure;
	}
	
	public void setJsDir(String jsDir) {
		this.jsDir = jsDir;
	}
	
	public void setPrepareScript(String prepare) {
		this.prepareScript = prepare;
	}
	
	public void setRhinoUnitDir(String rhinoUnitDir) {
		this.rhinoUnitDir = rhinoUnitDir;
	}

	public void add(FileSet fileset) {
		this.filesets.add(fileset);
	}
	
	@Override 
	public void execute() throws BuildException {
		JScriptExecutor executor = new JScriptExecutor(prepareScript, "$");
		Bindings bindings = executor.getEngine().getBindings(
				ScriptContext.ENGINE_SCOPE);
		
		bindings.put("project", getProject());
		
		Map<String, String> attributes = new HashMap<String, String>();
		attributes.put("options", options);
		attributes.put("haltOnFirstFailure", haltOnFirstFailure);
		attributes.put("ignoredGlobalVars", ignoredGlobalVars);
		bindings.put("attributes", attributes);
		
		Map<String, Object> elements = new HashMap<String, Object>();
		elements.put("fileset", filesets);
		bindings.put("elements", elements);
		bindings.put("self", this);
		
		try {
			executor.setJsDir(jsDir);
			executor.execute(new File(rhinoUnitDir, "rhinoUnitUtil.js"));
			executor.execute(new File(rhinoUnitDir, "rhinoUnitAnt.js"));
		} catch (ScriptException e) {
			throw new BuildException(e);
		}
	};
	
	public void fail(String failMessage) {
		throw new BuildException(failMessage);
	}
} 
