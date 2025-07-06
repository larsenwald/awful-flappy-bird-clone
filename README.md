Building a flappy bird game with html/css/js. Hoping to learn some fundamental game development techniques like physics and collision (and ofc practice object oriented programming)
https://larsenwald.github.io/awful-flappy-bird-clone/

## Post-project reflection

Much of this project was surprisingly intuitive.

### Making a responsive game screen.

Just make a #game element (the box that actually holds the game) with a locked aspect ratio, make everything inside use relative units, and voila, everything's responsive no matter the screen size.

Note - I initially had a hard time making font sizes responsive, but it turns out you can actually make a container element have a 'container-type' property of 'inline-size' and then use a unit relative to said container, like 'cqw' (container width) or 'cqi' (container inline size). This way, the font size scales with the container element, which is exactly what I wanted.

### Pillar spawing logic

Implementing the pillar logic was very straightforward - just used a bunch of clamped Math.random() calls to determine the height of the pillars being spawned as well as a 50/50 Math.random() to decide whether the pillar spawns from the top or bottom of the screen.

### Gravity

Even implementing gravity wasn't too difficult since I'd seen position, velocity, acceleration relationships before in physics and calculus. You have position representing your physical height in the air (clamped to above 0 and below 100), you have velocity which constantly increases or decreases position, and you have acceleration (gravity) with is a constant negative that decreases velocity at all times (unless position is 0). To jump, you simply give a positive increase to velocity and let acceleration and position do the rest.

### Collision

Trying to figure out collision stumped me. How could I know, at any given time, if the bird was directly touching a pillar?

In researching a solution to this problem, I came upon a game programming pattern called AABB - axis aligned bounding box. The concept is surprisingly elegant once it clicks: for every single frame, you're essentially asking two questions. First, are these objects overlapping horizontally? You check if the subject's right edge is past the object's left edge AND the object's right edge is past the subject's left edge. Then you ask the same thing vertically - is the subject's bottom below the object's top AND is the object's bottom below the subject's top? If both horizontal and vertical overlap are true simultaneously, boom, you've got collision.

Programmatically, it was very easy to implement this since the DOM-element prototype has a method called 'getBoundingClientRect()', which returns precise coordinates of the element you're querying. And I just ran this check between the subject (the bird) and the objects (the pillars) on _every_ single frame.

### Final thoughts

Overall, the project was a great learning experience. I solidified my OOP and separation-of-concerns skills, and learned how collision works.
