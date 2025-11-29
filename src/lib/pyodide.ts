import type { PyodideInterface } from 'pyodide';

let pyodideInstance: PyodideInterface | null = null;
let isLoading = false;
let loadPromise: Promise<PyodideInterface> | null = null;

// PhysicsLab Python library source code
const physicslabLib = {
  '__init__.py': `"""
PhysicsLab - Python library for physics simulations in the browser
"""

from .world import World
from .bodies import Ball, Platform
from .utils import random

__all__ = ['World', 'Ball', 'Platform', 'random']
`,

  'world.py': `"""
World - Physics world container
"""
import json

class World:
    """Physics world that contains all bodies and runs the simulation"""

    def __init__(self, gravity=9.81, width=800, height=600, boundaries=True):
        self.gravity = gravity
        self.width = width
        self.height = height
        self.boundaries = boundaries
        self.bodies = []
        self.time = 0
        print(f"World created: {width}x{height}, gravity={gravity}")

    def add(self, body):
        self.bodies.append(body)
        print(f"Added {body.__class__.__name__} to world")

    def remove(self, body):
        if body in self.bodies:
            self.bodies.remove(body)

    def get_state(self):
        """Return JSON-serializable world state for visualization"""
        state = {
            "width": self.width,
            "height": self.height,
            "gravity": self.gravity,
            "boundaries": self.boundaries,
            "bodies": []
        }

        for body in self.bodies:
            body_data = {
                "type": body.__class__.__name__,
                "x": body.x,
                "y": body.y
            }

            if hasattr(body, 'radius'):
                body_data["radius"] = body.radius
            if hasattr(body, 'color'):
                body_data["color"] = body.color
            if hasattr(body, 'width'):
                body_data["width"] = body.width
            if hasattr(body, 'height'):
                body_data["height"] = body.height
            if hasattr(body, 'vx'):
                body_data["vx"] = body.vx
            if hasattr(body, 'vy'):
                body_data["vy"] = body.vy
            if hasattr(body, 'fixed'):
                body_data["fixed"] = body.fixed

            state["bodies"].append(body_data)

        return state

    def run(self):
        print("Simulation started!")
        print(f"Total bodies: {len(self.bodies)}")
        for i, body in enumerate(self.bodies):
            print(f"  Body {i+1}: {body}")

        # Output world state as JSON for visualization
        state = self.get_state()
        print("__WORLD_STATE__")
        print(json.dumps(state))
        print("__END_WORLD_STATE__")

    def run_for(self, seconds):
        print(f"Running simulation for {seconds} seconds...")
        self.run()
`,

  'bodies.py': `"""
Bodies - Physical objects
"""
import math

class Ball:
    def __init__(self, x=0, y=0, radius=10, mass=1.0, color="blue", velocity=(0, 0), fixed=False):
        self.x = x
        self.y = y
        self.radius = radius
        self.mass = mass
        self.color = color
        self.vx, self.vy = velocity
        self.fixed = fixed

    def __repr__(self):
        return f"Ball(x={self.x}, y={self.y}, r={self.radius}, color={self.color})"

    def launch(self, angle, velocity):
        angle_rad = math.radians(angle)
        self.vx = velocity * math.cos(angle_rad)
        self.vy = velocity * math.sin(angle_rad)
        print(f"Launched ball at {angle}° with velocity {velocity}")

class Platform:
    def __init__(self, x=0, y=0, width=100, height=10, angle=0, friction=0.5, bounciness=0.8):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.angle = angle
        self.friction = friction
        self.bounciness = bounciness
        self.fixed = True

    def __repr__(self):
        return f"Platform(x={self.x}, y={self.y}, {self.width}x{self.height})"

    def contains(self, point):
        px, py = point if isinstance(point, tuple) else (point.x, point.y)
        return (self.x <= px <= self.x + self.width and
                self.y <= py <= self.y + self.height)
`,

  'utils.py': `"""
Utils - Helper functions
"""
import random as _random
import math

def random(min_val, max_val):
    return _random.uniform(min_val, max_val)

def distance(point1, point2):
    x1, y1 = point1 if isinstance(point1, tuple) else (point1.x, point1.y)
    x2, y2 = point2 if isinstance(point2, tuple) else (point2.x, point2.y)
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

def to_radians(degrees):
    return math.radians(degrees)

def to_degrees(radians):
    return math.degrees(radians)
`,
};

// MathLab Python library source code
const mathlabLib = {
  '__init__.py': `"""
MathLab - Python library for interactive mathematics in the browser
"""

from .function import Function
from .canvas import Canvas
from .geometry import Point, Line, Circle, Triangle, Rectangle, Vector

__all__ = ['Function', 'Canvas', 'Point', 'Line', 'Circle', 'Triangle', 'Rectangle', 'Vector']
`,

  'function.py': `"""
Function - Mathematical function representation
"""
import json
import math

class Function:
    """A mathematical function that can be plotted and manipulated"""

    def __init__(self, expression):
        """
        Create a function from a string expression

        Args:
            expression: String like "2*x", "x**2 + 3*x - 1", "sin(x)", etc.
        """
        self.expression = expression
        self._compile_function()

    def _compile_function(self):
        """Compile the expression into a callable function"""
        # Create a safe namespace with math functions
        safe_dict = {
            'sin': math.sin,
            'cos': math.cos,
            'tan': math.tan,
            'sqrt': math.sqrt,
            'abs': abs,
            'log': math.log,
            'exp': math.exp,
            'pi': math.pi,
            'e': math.e,
        }

        try:
            # Create lambda function from expression
            self._func = lambda x: eval(self.expression, {"__builtins__": {}}, {**safe_dict, 'x': x})
        except Exception as e:
            print(f"Error compiling function: {e}")
            self._func = lambda x: 0

    def __call__(self, x):
        """Evaluate function at x"""
        try:
            return self._func(x)
        except:
            return None

    def __repr__(self):
        return f"Function('{self.expression}')"

    def evaluate_range(self, x_min, x_max, num_points=200):
        """Evaluate function over a range"""
        step = (x_max - x_min) / (num_points - 1)
        points = []

        for i in range(num_points):
            x = x_min + i * step
            y = self(x)
            if y is not None and not math.isnan(y) and not math.isinf(y):
                points.append([x, y])

        return points
`,

  'canvas.py': `"""
Canvas - Interactive canvas for plotting functions and shapes
"""
import json

class Canvas:
    """Canvas for plotting mathematical functions and shapes"""

    def __init__(self, x_range=(-5, 5), y_range=(-5, 5), grid=True):
        """
        Create a canvas for plotting

        Args:
            x_range: Tuple (min, max) for x-axis
            y_range: Tuple (min, max) for y-axis
            grid: Whether to show grid
        """
        self.x_range = x_range
        self.y_range = y_range
        self.grid = grid
        self.functions = []
        self.points = []
        self.lines = []
        self.shapes = []
        self.annotations = []

    def plot(self, func, color="blue", name=None, style="solid"):
        """
        Plot a function

        Args:
            func: Function object to plot
            color: Color of the plot
            name: Name for legend
            style: "solid", "dashed", "dotted"
        """
        # Evaluate function over x_range
        points = func.evaluate_range(self.x_range[0], self.x_range[1])

        self.functions.append({
            "expression": func.expression,
            "points": points,
            "color": color,
            "name": name or func.expression,
            "style": style
        })

        print(f"Plotted: {name or func.expression}")

    def mark_point(self, x, y, label=None, color="red"):
        """Mark a specific point on the canvas"""
        self.points.append({
            "x": x,
            "y": y,
            "label": label,
            "color": color
        })

        if label:
            print(f"Point {label}: ({x}, {y})")

    def draw_line(self, point1, point2, color="gray", style="solid"):
        """Draw a line between two points"""
        self.lines.append({
            "from": point1,
            "to": point2,
            "color": color,
            "style": style
        })

    def add_text(self, x, y, text, color="black"):
        """Add text annotation"""
        self.annotations.append({
            "x": x,
            "y": y,
            "text": text,
            "color": color
        })

    def show(self):
        """Display the canvas (outputs JSON for JS visualization)"""
        state = {
            "type": "MATH_CANVAS",
            "settings": {
                "x_range": self.x_range,
                "y_range": self.y_range,
                "grid": self.grid
            },
            "functions": self.functions,
            "points": self.points,
            "lines": self.lines,
            "shapes": self.shapes,
            "annotations": self.annotations
        }

        print("__MATH_CANVAS_STATE__")
        print(json.dumps(state))
        print("__END_MATH_CANVAS_STATE__")
`,

  'geometry.py': `"""
Geometry - Points, lines, shapes for geometric visualization
"""
import math

class Point:
    """A point in 2D space"""
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"

class Vector:
    """A 2D vector"""
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __add__(self, other):
        return Vector(self.x + other.x, self.y + other.y)

    def __sub__(self, other):
        return Vector(self.x - other.x, self.y - other.y)

    def magnitude(self):
        return math.sqrt(self.x**2 + self.y**2)

    def dot(self, other):
        return self.x * other.x + self.y * other.y

    def __repr__(self):
        return f"Vector({self.x}, {self.y})"

class Line:
    """A line in 2D space"""
    def __init__(self, through=None, slope=None, intercept=None):
        self.through = through  # List of points
        self.slope = slope
        self.intercept = intercept

    def __repr__(self):
        return f"Line(slope={self.slope}, intercept={self.intercept})"

class Circle:
    """A circle in 2D space"""
    def __init__(self, center=(0, 0), radius=1):
        self.center = center
        self.radius = radius

    def __repr__(self):
        return f"Circle(center={self.center}, r={self.radius})"

class Triangle:
    """A triangle defined by three vertices"""
    def __init__(self, vertices):
        self.vertices = vertices  # List of 3 tuples (x, y)

    def translate(self, dx, dy):
        """Translate triangle by (dx, dy)"""
        new_vertices = [(x + dx, y + dy) for x, y in self.vertices]
        return Triangle(new_vertices)

    def __repr__(self):
        return f"Triangle({self.vertices})"

class Rectangle:
    """A rectangle"""
    def __init__(self, corner=(0, 0), width=1, height=1, center=None):
        if center:
            self.center = center
            self.width = width
            self.height = height
            self.corner = (center[0] - width/2, center[1] - height/2)
        else:
            self.corner = corner
            self.width = width
            self.height = height
            self.center = (corner[0] + width/2, corner[1] + height/2)

    def translate(self, dx, dy):
        """Translate rectangle"""
        return Rectangle(
            corner=(self.corner[0] + dx, self.corner[1] + dy),
            width=self.width,
            height=self.height
        )

    def __repr__(self):
        return f"Rectangle(corner={self.corner}, {self.width}x{self.height})"
`,
};

/**
 * Load Pyodide from CDN
 */
export async function loadPyodide(): Promise<PyodideInterface> {
  if (pyodideInstance) {
    return pyodideInstance;
  }

  if (isLoading && loadPromise) {
    return loadPromise;
  }

  isLoading = true;
  loadPromise = (async () => {
    try {
      console.log('Loading Pyodide...');

      const { loadPyodide: load } = await import('pyodide');

      const pyodide = await load({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
      });

      console.log('Pyodide loaded, installing libraries...');

      // Create physicslab directory and files
      pyodide.FS.mkdirTree('/lib/python3.13/site-packages/physicslab');

      for (const [filename, content] of Object.entries(physicslabLib)) {
        pyodide.FS.writeFile(
          `/lib/python3.13/site-packages/physicslab/${filename}`,
          content
        );
      }

      console.log('✓ PhysicsLab library installed');

      // Create mathlab directory and files
      pyodide.FS.mkdirTree('/lib/python3.13/site-packages/mathlab');

      for (const [filename, content] of Object.entries(mathlabLib)) {
        pyodide.FS.writeFile(
          `/lib/python3.13/site-packages/mathlab/${filename}`,
          content
        );
      }

      console.log('✓ MathLab library installed');
      pyodideInstance = pyodide;
      isLoading = false;

      return pyodide;
    } catch (error) {
      isLoading = false;
      loadPromise = null;
      console.error('Failed to load Pyodide:', error);
      throw error;
    }
  })();

  return loadPromise;
}

/**
 * Execute Python code
 */
export async function runPythonCode(code: string): Promise<{
  success: boolean;
  output: string;
  error?: string;
}> {
  try {
    const pyodide = await loadPyodide();

    let output = '';
    pyodide.setStdout({
      batched: (msg) => {
        output += msg + '\n';
      },
    });

    try {
      const result = await pyodide.runPythonAsync(code);

      return {
        success: true,
        output: output || String(result || ''),
      };
    } catch (execError: any) {
      return {
        success: false,
        output: output,
        error: execError.message || String(execError),
      };
    }
  } catch (loadError: any) {
    return {
      success: false,
      output: '',
      error: `Failed to load Python runtime: ${loadError.message}`,
    };
  }
}

/**
 * Check if Pyodide is loaded
 */
export function isPyodideLoaded(): boolean {
  return pyodideInstance !== null;
}

/**
 * Get Pyodide instance (if loaded)
 */
export function getPyodide(): PyodideInterface | null {
  return pyodideInstance;
}
