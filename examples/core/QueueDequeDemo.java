import java.util.ArrayDeque;
import java.util.Deque;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * Topic 38: The Queue & Deque Hierarchy - Basic Example
 * Demonstrates Queue FIFO mechanics, PriorityQueue min-heap behavior, and ArrayDeque.
 */
public class QueueDequeDemo {

    public static void main(String[] args) {
        // 1. ArrayDeque as FIFO Queue (offer, poll, peek)
        Queue<String> taskQueue = new ArrayDeque<>();
        taskQueue.offer("Job-Alpha");
        taskQueue.offer("Job-Beta");
        taskQueue.offer("Job-Gamma");

        System.out.println("FIFO Peek: " + taskQueue.peek());
        System.out.println("FIFO Poll 1: " + taskQueue.poll());
        System.out.println("FIFO Poll 2: " + taskQueue.poll());

        // 2. ArrayDeque as LIFO Stack (push, pop) - replaces legacy java.util.Stack
        Deque<String> undoStack = new ArrayDeque<>();
        undoStack.push("Action-Edit");
        undoStack.push("Action-Format");
        undoStack.push("Action-Delete");

        System.out.println("LIFO Pop 1: " + undoStack.pop());
        System.out.println("LIFO Pop 2: " + undoStack.pop());

        // 3. PriorityQueue: orders elements by natural ordering (min-heap)
        Queue<Integer> priorityQueue = new PriorityQueue<>();
        priorityQueue.offer(45);
        priorityQueue.offer(12);
        priorityQueue.offer(89);
        priorityQueue.offer(5);

        System.out.println("Min-heap extraction order:");
        while (!priorityQueue.isEmpty()) {
            System.out.print(priorityQueue.poll() + " ");
        }
        System.out.println();
    }
}
