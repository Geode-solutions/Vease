import opengeode as og 
import opengeode_geosciences as ogg
import geode_implicit 
import geode_explicit
import opengeode_inspector
import random


# Load file to update

data_name = "test.og_tso3d"
data = og.load_tetrahedral_solid3D(data_name)

# Attribute properties
values = og.AttributeValuesDouble()
# values = og.AttributeValuesArrayDouble3()
values.default_value = 1.
values.no_value = 0.
# values.default_value = [1., 2., 3.]
# values.no_value = [0., 0., 0.]
properties=og.AttributeProperties()
properties.assignable=False
properties.interpolable=False
properties.transferable=True

vertex_attribute_name = "test_vertex"
vertex_attribute_name2 = "test_vertex2"
edge_attribute_name = "test_edge"
edge_attribute_name2= "test_edge2"
cell_attribute_name = "test_cell"
cell_attribute_name2 = "test_cell2"
polygon_attribute_name = "test_polygon"
polygon_attribute_name2 = "test_polygon2"
polyhedron_attribute_name = "test_polyhedron"
polyhedron_attribute_name2 = "test_polyhedron2"

# for attribute_id in data.vertex_attribute_manager().attribute_ids():
#     print(data.vertex_attribute_manager().find_generic_attribute(attribute_id).name())

# attribute_ids = data.vertex_attribute_manager().attribute_ids_matching_name("test_vertex")

# if attribute_ids != None:
#     for attribute_id in attribute_ids:
#         print(attribute_id)
#         data.vertex_attribute_manager().delete_attribute(attribute_id)

# attribute_ids = data.vertex_attribute_manager().attribute_ids_matching_name("test_vertex2")

# if attribute_ids != None:
#     for attribute_id in attribute_ids:
#         print(attribute_id)
#         data.vertex_attribute_manager().delete_attribute(attribute_id)

# Create attribute on vertices
# vertex_attribute_manager = data.vertex_attribute_manager()
# attribute_id = vertex_attribute_manager.create_attribute_variable_double("test_vertex",values,properties)
# attribute = vertex_attribute_manager.find_attribute_variable_double(attribute_id)
# counter =1.
# for vertex_id in range(data.nb_vertices()):
#     attribute.set_value(vertex_id,counter)
#     counter += 1.5

# attribute_id2 = vertex_attribute_manager.create_attribute_variable_double("test_vertex2",values,properties)
# attribute = vertex_attribute_manager.find_attribute_variable_double(attribute_id2)
# counter =1.
# for vertex_id in range(data.nb_vertices()):
#     attribute.set_value(vertex_id,counter)
#     randowm_number = random.uniform(-100,100)
#     counter += randowm_number


ALL_TEST_NAMES = [vertex_attribute_name,
    vertex_attribute_name2,
    edge_attribute_name,
    edge_attribute_name2,
    cell_attribute_name,
    cell_attribute_name2,
    polygon_attribute_name,
    polygon_attribute_name2,
    polyhedron_attribute_name,
    polyhedron_attribute_name2
]

def cleanup_attribute_manager(attribute_manager):
    for name in ALL_TEST_NAMES:
        delete_attribute_name(attribute_manager, name)

def delete_attribute_name(attribute_manager, attribute_name):
    for attribute_id in attribute_manager.attribute_ids():
         print(attribute_manager.find_generic_attribute(attribute_id).name())
    attribute_ids = attribute_manager.attribute_ids_matching_name(attribute_name)
    if attribute_ids != None:
        print(f"{attribute_ids=}", flush=True)
        for attribute_id in attribute_ids:
            print("deleting attribute " + attribute_id.string())
            attribute_manager.delete_attribute(attribute_id)

def create_attribute(attribute_manager, attribute_name, values, properties):
    attribute_id = attribute_manager.create_attribute_variable_double(attribute_name, values, properties)
    # attribute_id = attribute_manager.create_attribute_variable_arraydouble3(attribute_name, values, properties)
    return attribute_manager.find_attribute_variable_double(attribute_id)
    # return attribute_manager.find_attribute_variable_arraydouble3(attribute_id)


# Model
# for corner in data.corners():
#     mesh = corner.mesh()

#     # Create attribute on vertices
#     vertex_attribute_manager = mesh.vertex_attribute_manager()
#     cleanup_attribute_manager(vertex_attribute_manager)
#     attribute = create_attribute(vertex_attribute_manager, vertex_attribute_name, values, properties)
#     counter =[0., 0., 0.]
#     for vertex_id in range(mesh.nb_vertices()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(vertex_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3

# for line in data.lines():
#     mesh = line.mesh()

#     # Create attribute on vertices
#     vertex_attribute_manager = mesh.vertex_attribute_manager()
#     cleanup_attribute_manager(vertex_attribute_manager)
#     attribute = create_attribute(vertex_attribute_manager, vertex_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for vertex_id in range(mesh.nb_vertices()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(vertex_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3
#     # Create attribute on edges
#     edge_attribute_manager = mesh.edge_attribute_manager()
#     cleanup_attribute_manager(edge_attribute_manager)
#     attribute = create_attribute(edge_attribute_manager, edge_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for edge_id in range(mesh.nb_edges()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(edge_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3


# for surface in data.surfaces():
#     mesh = surface.mesh()

#     # Create attribute on vertices
#     vertex_attribute_manager = mesh.vertex_attribute_manager()
#     cleanup_attribute_manager(vertex_attribute_manager)
#     attribute = create_attribute(vertex_attribute_manager, vertex_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for vertex_id in range(mesh.nb_vertices()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(vertex_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3

#     # Create attribute on polygons
#     polygon_attribute_manager = mesh.polygon_attribute_manager()
#     cleanup_attribute_manager(polygon_attribute_manager)
#     attribute = create_attribute(polygon_attribute_manager, polygon_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for polygon_id in range(mesh.nb_polygons()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(polygon_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3
# for block in data.blocks():
#     mesh = block.mesh()

#     # Create attribute on vertices
#     vertex_attribute_manager = mesh.vertex_attribute_manager()
#     cleanup_attribute_manager(vertex_attribute_manager)
#     attribute = create_attribute(vertex_attribute_manager, vertex_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for vertex_id in range(mesh.nb_vertices()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(vertex_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3

#     # Create attribute on polyhedra
#     polyhedron_attribute_manager = mesh.polyhedron_attribute_manager()
#     cleanup_attribute_manager(polyhedron_attribute_manager)
#     attribute = create_attribute(polyhedron_attribute_manager, polyhedron_attribute_name, values, properties)
#     counter = [0., 0., 0.]
#     for polyheron_id in range(mesh.nb_polyhedra()):
#         randowm_number1 = random.uniform(-100,100)
#         randowm_number2 = random.uniform(-100,100)
#         randowm_number3 = random.uniform(-100,100)
#         vector = [randowm_number1, randowm_number2, randowm_number3]
#         attribute.set_value(polyheron_id, vector)
#         counter[0] += randowm_number1
#         counter[1] += randowm_number2
#         counter[2] += randowm_number3

# # Create attribute on vertices
vertex_attribute_manager = data.vertex_attribute_manager()
cleanup_attribute_manager(vertex_attribute_manager)
attribute = create_attribute(vertex_attribute_manager, vertex_attribute_name, values, properties)
for vertex_id in range(data.nb_vertices()):
    randowm_number = random.uniform(-100,100)
    attribute.set_value(vertex_id, randowm_number)

attribute = create_attribute(vertex_attribute_manager, "test_vertex2", values, properties)
counter =2.
for vertex_id in range(data.nb_vertices()):
    attribute.set_value(vertex_id, counter)
    randowm_number = random.uniform(-1, 1)
    counter += randowm_number

# Create attribute on edges
# edge_attribute_manager = data.edge_attribute_manager()
# cleanup_attribute_manager(edge_attribute_manager)
# attribute = create_attribute(edge_attribute_manager, edge_attribute_name, values, properties)
# counter =2.
# for edge_id in range(data.nb_edges()):
#     attribute.set_value(edge_id, counter)
#     randowm_number = random.uniform(-1, 1)
#     counter += randowm_number


# # Create attribute on cells
# cell_attribute_manager = data.cell_attribute_manager()
# cleanup_attribute_manager(cell_attribute_manager)
# attribute = create_attribute(cell_attribute_manager, cell_attribute_name, values, properties)
# counter =2.
# for cell_id in range(data.nb_cells()):
#     attribute.set_value(cell_id, counter)
#     randowm_number = random.uniform(-1, 1)
#     counter += randowm_number

# # # Create attribute on polygons
# polygon_attribute_manager = data.polygon_attribute_manager()
# cleanup_attribute_manager(polygon_attribute_manager)
# attribute = create_attribute(polygon_attribute_manager, polygon_attribute_name, values, properties)
# counter =2.
# for cell_id in range(data.nb_polygons()):
#     attribute.set_value(cell_id, counter)
#     randowm_number = random.uniform(-1, 1)
#     counter += randowm_number

# # Create attribute on polyhedrons
polyhedron_attribute_manager = data.polyhedron_attribute_manager()
cleanup_attribute_manager(polyhedron_attribute_manager)
attribute = create_attribute(polyhedron_attribute_manager, polyhedron_attribute_name, values, properties)
counter =2.
for cell_id in range(data.nb_polyhedra()):
    attribute.set_value(cell_id, counter)
    randowm_number = random.uniform(-1, 1)
    counter += randowm_number



# Save updated file
og.save_tetrahedral_solid3D(data, data_name)