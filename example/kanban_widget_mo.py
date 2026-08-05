import marimo

__generated_with = "0.23.16"
app = marimo.App(width="medium")

with app.setup:
    import marimo as mo

    from anywidget_kanban_board import KanbanWidget


@app.cell
def _():
    cards = [
        {
            "id": "c1",
            "title": "New task",
            "desc": "The task's description",
            "tags": {"new", "task"},
            "column": "todo",
        },
    ]
    return (cards,)


@app.cell
def _(cards):
    kanban = KanbanWidget()
    widget = mo.ui.anywidget(kanban)
    widget.cards = cards
    widget
    return (widget,)


@app.cell
def _(widget):
    {
        "Task states": {card["title"]: card["column"] for card in widget.cards},
    }
    return


if __name__ == "__main__":
    app.run()
