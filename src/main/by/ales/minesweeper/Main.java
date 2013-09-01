package by.ales.minesweeper;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.MissingResourceException;
import java.util.ResourceBundle;
import java.util.prefs.BackingStoreException;
import java.util.prefs.Preferences;

import by.ales.javascript.DirRequireBuilder;
import by.ales.javascript.RhinoExecutor;

public class Main {

    private static final String JSDIR_KEY = "jsDir";
    private static final String MAIN_KEY = "mainscript";
    private static final String DEBUG_SETTINGS_KEY = "debugPort";

    public static void main(String[] arguments) throws IOException {
        // default settings
        String jsDir = "js/";
        String main = "main.js";
        String bundleName = "by.ales.minesweeper.settings";

        List<String> args = Arrays.asList(arguments);

        if (args.contains("clearPreferences")) {
            try {
                Preferences.userNodeForPackage(Main.class).clear();
            } catch (BackingStoreException e) {
                e.printStackTrace();
            }
        }

        boolean debug = args.contains("debug");
        String debugSettings = "transport=socket,suspend=y,address=9000";

        try {
            ResourceBundle bundle = ResourceBundle.getBundle(bundleName);
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

        DirRequireBuilder builder = new DirRequireBuilder();
        builder.addJSDir(jsDir);

        RhinoExecutor executor = new RhinoExecutor(builder);

        if (debug) {
            executor.startDebugger(debugSettings);
        }

        executor.execute(main);

        // We shouldn't stop debugger in this thread because AWT creates it's
        // own event-dispatching thread and this thread stops before exit
        // executor.stopDebugger();
    }
}
