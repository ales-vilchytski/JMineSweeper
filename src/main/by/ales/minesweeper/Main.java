package by.ales.minesweeper;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

import javax.script.ScriptException;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.commonjs.module.ModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.Require;
import org.mozilla.javascript.commonjs.module.provider.ModuleSourceProvider;
import org.mozilla.javascript.commonjs.module.provider.SoftCachingModuleScriptProvider;
import org.mozilla.javascript.commonjs.module.provider.UrlModuleSourceProvider;

public class Main {

	private static final String JSDIR_KEY = "jsDir";
	private static final String MAIN_KEY = "mainscript";
	
	public static void main(String[] args) throws ScriptException, URISyntaxException, IOException {
		//TODO add args parser
		if (args.length > 0) {
			if (args[0].equals("clear")) {
				try {
					Preferences.userNodeForPackage(Main.class).clear();
					
				} catch (BackingStoreException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		
		//default settings
		String jsDir = "/js/";
		String main = "main.js";
		String bundleName = "by.ales.minesweeper.settings";
		
		try {
			if (args.length > 1) {
				bundleName = args[0];
			}
			ResourceBundle bundle = 
					ResourceBundle.getBundle(bundleName);
			if (bundle.containsKey(JSDIR_KEY)) {
				jsDir = bundle.getString(JSDIR_KEY);	
			}
			if (bundle.containsKey(MAIN_KEY)) {
				main = bundle.getString(MAIN_KEY);	
			}
		} catch (MissingResourceException exc) {
			exc.printStackTrace();
		}
		
		List<URI> lookupPaths = new LinkedList<URI>();
		URI uri = Main.class.getResource(jsDir).toURI();
		lookupPaths.add(uri);
		
		ContextFactory fact = new ContextFactory();
		Context ctx = fact.enterContext();
		try {	
			ScriptableObject scope = ctx.initStandardObjects();
			
			ModuleSourceProvider sourceProvider = 
					new UrlModuleSourceProvider(lookupPaths, null);
			ModuleScriptProvider scriptProvider = 
					new SoftCachingModuleScriptProvider(sourceProvider);
			
			Require require = new Require(ctx, scope, scriptProvider, null, null, false);
			require.install(scope);
			ctx.evaluateReader(
					scope, 
					new BufferedReader(
							new InputStreamReader(
									Main.class.getResourceAsStream(combine(jsDir, main)))), 
					main, 
					1, 
					null);
			
		} finally {
			Context.exit();
		}
		
	}
	
	public static String combine(String... parts) {
		String result = "";
		for (String part : parts) {
			result += part + "/";
		}
		return result;
	}
}
