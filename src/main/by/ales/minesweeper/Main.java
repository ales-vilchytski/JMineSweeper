package by.ales.minesweeper;

import java.lang.reflect.Constructor;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.ContextFactory.Listener;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.commonjs.module.ModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.Require;
import org.mozilla.javascript.commonjs.module.provider.ModuleSourceProvider;
import org.mozilla.javascript.commonjs.module.provider.SoftCachingModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.provider.UrlModuleSourceProvider;

public class Main {

	private static final String JSDIR_KEY = "jsDir";
	private static final String MAIN_KEY = "mainscript";
	private static final String DEBUG_SETTINGS_KEY = "debugPort";
	
	public static void main(String[] args) throws URISyntaxException {
		//default settings
		String jsDir = "/js/";
		String main = "main.js";
		String bundleName = "by.ales.minesweeper.settings";
		
		//To use scripts debug:
		// 1. Put jars for debugging to classpath:
		//   - org.eclipse.wst.jsdt.debug.rhino.debugger
		//   - org.eclipse.wst.jsdt.debug.transport
		//   * they can be found at Eclipse IDE home when JSDT for Rhino installed
		// 2. Start application with argument 'debug'
		// 3. Start remote Rhino debugger (usually from Eclipse IDE)
		// 4. Enjoy
		//   * Tip: use 'Add script load breakpoint' at first usage
		boolean debug = false;
		String debugSettings = "transport=socket,suspend=y,address=9000";
		
		//TODO add args parser
		if (args.length > 0) {
			for (String arg : args) {
				if (arg.equals("clearPreferences")) {
					try {
						Preferences.userNodeForPackage(Main.class).clear();
					} catch (BackingStoreException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				} else if (arg.equals("debug")) {
					debug = true;
				} else { //bundle name
					bundleName = arg;
				}
			}
		}
		
		try {
			ResourceBundle bundle = 
					ResourceBundle.getBundle(bundleName);
			if (bundle.containsKey(JSDIR_KEY)) {
				jsDir = bundle.getString(JSDIR_KEY);	
			}
			if (bundle.containsKey(MAIN_KEY)) {
				main = bundle.getString(MAIN_KEY);	
			}
			if (bundle.containsKey(DEBUG_SETTINGS_KEY)) {
				debugSettings = bundle.getString(DEBUG_SETTINGS_KEY);
			}
		} catch (MissingResourceException exc) {
			exc.printStackTrace();
		}
		
		List<URI> lookupPaths = new LinkedList<URI>();
		URI mainUri = Main.class.getResource(jsDir).toURI();
		lookupPaths.add(mainUri);

		ContextFactory ctxFactory = new ContextFactory();
		Listener debugger = null;
		
		//There is no static dependency on debugging jars, only dynamic creation and usage
		if (debug) {
			Constructor<?> debuggerConstructor;
			try {
				debuggerConstructor = Class.forName(
						"org.eclipse.wst.jsdt.debug.rhino.debugger.RhinoDebugger", 
						true, 
						Main.class.getClassLoader()).getConstructor(String.class);
				debugger = (Listener) debuggerConstructor.newInstance(debugSettings);
				
				debugger.getClass().getMethod("start").invoke(debugger);				
				ctxFactory.addListener(debugger);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		
		Context ctx = ctxFactory.enterContext();
		try {	
			ScriptableObject scope = ctx.initStandardObjects();
			if(debugger != null) { //put debugger in scope to avoid garbage collection
				scope.put("debugger$for$rhino", scope, debugger);
			}
			
			ModuleSourceProvider sourceProvider = 
					new UrlModuleSourceProvider(lookupPaths, null);
			ModuleScriptProvider scriptProvider = 
					new SoftCachingModuleScriptProvider(sourceProvider);
			
			Require require = 
					new Require(ctx, scope, scriptProvider, null, null, false);

			require.requireMain(ctx, main);
		} finally {
			Context.exit();
		}
		
		//Because scripts use AWT, they spawn another thread
		//then debugger shouldn't be stopped in this thread
		/*if (debug && debugger != null) {
			try {
				debugger.getClass().getMethod("stop").invoke(debugger);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}*/
	}
	
	public static String combine(String... parts) {
		String result = "";
		for (String part : parts) {
			result.concat( (part.endsWith("/")) ? (part) : (part + "/") );
		}
		return result;
	}
}
