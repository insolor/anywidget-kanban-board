from pathlib import Path

import anywidget
import traitlets

current_dir = Path(__file__).parent


class KanbanWidget(anywidget.AnyWidget):
    _esm = (current_dir / "kanban_board_esm.js").read_text()
    _css = (current_dir / "kanban_board.css").read_text()

    cards = traitlets.List(
        trait=traitlets.Dict(),
    ).tag(sync=True)

    columns = traitlets.List(
        trait=traitlets.Dict(),
        default_value=[
            {"id": "todo", "title": "TODO"},
            {"id": "doing", "title": "Doing"},
            {"id": "done", "title": "Done"},
        ],
    ).tag(sync=True)
