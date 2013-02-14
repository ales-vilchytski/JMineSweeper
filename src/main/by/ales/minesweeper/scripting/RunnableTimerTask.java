package by.ales.minesweeper.scripting;

import java.util.TimerTask;

public class RunnableTimerTask extends TimerTask {

	private Runnable task;
	
	public RunnableTimerTask(Runnable task) {
		this.task = task;
	}
	
	@Override
	public void run() {
		task.run();
	}

}
