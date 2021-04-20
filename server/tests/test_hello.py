import unittest

class TestHelloWorld(unittest.TestCase):
  def test_hello(self):
    self.assertEqual(2 + 2, 4)
