import { store } from "../configureStore";

describe("configureAppStore", () => {

  it("should initialize the store with the correct reducer", () => {
    expect(store.getState()).toEqual(
      expect.objectContaining({
        tasks: expect.any(Object), // Ensure 'tasks' reducer is present
      })
    );
  });

  it("should return a valid dispatch function", () => {
    expect(store.dispatch).toBeInstanceOf(Function);
  });

  it("should allow dispatching actions", () => {
    const initialState = store.getState();
    expect(initialState.tasks).toBeDefined(); // Ensure tasks reducer exists

    const action = { type: "tasks/addTask", payload: { id: 1, title: "New Task" } };
    store.dispatch(action);

    const updatedState = store.getState();
    expect(updatedState.tasks).not.toEqual(initialState.tasks); // State should change
  });
});
