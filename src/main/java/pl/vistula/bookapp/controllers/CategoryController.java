package pl.vistula.bookapp.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import pl.vistula.bookapp.jpa.model.Category;
import pl.vistula.bookapp.jpa.repository.CategoryRepository;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@Slf4j
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping("/")
    List<Category> list() {
        log.info("Getting list of categories");

        return categoryRepository.findAll();
    }

    @PostMapping("/save")
    public Category save(@RequestBody Category category) {
        log.info("Saving category: {}", category);

        return categoryRepository.save(category);
    }

    @GetMapping("/{id}")
    ResponseEntity<Category> get(@PathVariable Long id) {
        log.info("Getting category with id: {}", id);
        return categoryRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    void delete(@PathVariable Long id) {
        log.info("Deleting category with id: {}", id);
        categoryRepository.deleteById(id);
    }

  }
